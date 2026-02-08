import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload comes from JWT
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}


// What this does

// Reads token from Authorization: Bearer <token>

// Verifies signature using JWT_SECRET

// If valid → validate() runs

// Whatever validate() returns → becomes req.user